// Shim kept for backward-compat imports – delegates to aiProvider
export { getApiKey, deleteProviderAndKey as deleteApiKey, maskApiKey } from "@/lib/aiProvider";
export { saveProviderAndKey as saveApiKey } from "@/lib/aiProvider";
