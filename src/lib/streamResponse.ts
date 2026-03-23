export type StreamCallback = (token: string) => void;
export type DoneCallback = () => void;

// Parse OpenAI SSE stream
async function parseOpenAIStream(
  response: Response,
  onToken: StreamCallback,
  onDone: DoneCallback
) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onToken(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

// Parse Anthropic SSE stream
async function parseAnthropicStream(
  response: Response,
  onToken: StreamCallback,
  onDone: DoneCallback
) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
          onToken(parsed.delta.text);
        } else if (parsed.type === "message_stop") {
          onDone();
          return;
        }
      } catch {
        // partial line
        break;
      }
    }
  }
  onDone();
}

export interface StreamOptions {
  provider: "openai" | "anthropic";
  apiKey: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  systemPrompt: string;
  onToken: StreamCallback;
  onDone: DoneCallback;
  onError: (err: string) => void;
}

export async function streamChatResponse(options: StreamOptions) {
  const { provider, apiKey, messages, systemPrompt, onToken, onDone, onError } = options;

  try {
    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.filter((m) => m.role !== "system"),
          ],
          temperature: 0.7,
          max_tokens: 4096,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error?.message ?? `Erreur OpenAI (${response.status})`;
        if (response.status === 429) onError("Limite d'appels atteinte. Réessayez dans quelques secondes.");
        else if (response.status === 401) onError("Clé API OpenAI invalide. Vérifiez vos paramètres.");
        else onError(msg);
        return;
      }

      await parseOpenAIStream(response, onToken, onDone);
    } else {
      // Anthropic
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemPrompt,
          messages: messages.filter((m) => m.role !== "system"),
          stream: true,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error?.message ?? `Erreur Anthropic (${response.status})`;
        if (response.status === 429) onError("Limite d'appels atteinte. Réessayez dans quelques secondes.");
        else if (response.status === 401) onError("Clé API Anthropic invalide. Vérifiez vos paramètres.");
        else onError(msg);
        return;
      }

      await parseAnthropicStream(response, onToken, onDone);
    }
  } catch (e) {
    onError("Erreur de connexion. Vérifiez votre connexion internet.");
  }
}
