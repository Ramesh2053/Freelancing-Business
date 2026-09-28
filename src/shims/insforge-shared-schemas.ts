/**
 * Shim for @insforge/shared-schemas
 */

export const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export type ErrorCode = keyof typeof ERROR_CODES | string;

export const oAuthProvidersSchema = {
  options: ['google', 'github', 'discord', 'apple'],
  parse: (v: any) => v,
  safeParse: (v: any) => ({ success: true, data: v }),
};

export const OAuthProvidersSchema = oAuthProvidersSchema;
export const UserSchema = {};
export const StorageFileSchema = {};
export const ListObjectsResponseSchema = {};

export type UserSchema = any;
export type CreateUserRequest = any;
export type CreateUserResponse = any;
export type CreateSessionRequest = any;
export type CreateSessionResponse = any;
export type SendOTPRequest = any;
export type RefreshSessionResponse = any;
export type GetProfileResponse = any;
export type SendVerificationEmailRequest = any;
export type VerifyEmailRequest = any;
export type VerifyEmailResponse = any;
export type SendResetPasswordEmailRequest = any;
export type ExchangeResetPasswordTokenRequest = any;
export type ExchangeResetPasswordTokenResponse = any;
export type ResetPasswordResponse = any;
export type GetPublicAuthConfigResponse = any;
export type DeleteObjectsResponse = any;
export type ChatCompletionRequest = any;
export type ImageGenerationRequest = any;
export type EmbeddingsRequest = any;
export type SubscribeResponse = any;
export type SocketMessage = any;
export type PresenceMember = any;
export type SendRawEmailRequest = any;
export type SendEmailResponse = any;
export type StripeEnvironment = any;
export type CreateCheckoutSessionBody = any;
export type CreateCheckoutSessionResponse = any;
export type CreateCustomerPortalSessionBody = any;
export type CreateCustomerPortalSessionResponse = any;
export type RazorpayEnvironment = any;
export type CreateRazorpayOrderBody = any;
export type CreateRazorpayOrderResponse = any;
export type VerifyRazorpayOrderBody = any;
export type VerifyRazorpayOrderResponse = any;
export type CreateRazorpaySubscriptionBody = any;
export type CreateRazorpaySubscriptionResponse = any;
export type VerifyRazorpaySubscriptionBody = any;
export type VerifyRazorpaySubscriptionResponse = any;
export type CancelRazorpaySubscriptionBodyInput = any;
export type CancelRazorpaySubscriptionResponse = any;
export type PauseRazorpaySubscriptionResponse = any;
export type ResumeRazorpaySubscriptionResponse = any;
export type AuthErrorResponse = any;
export type DeleteObjectResult = any;
export type RealtimeErrorPayload = any;
export type SendEmailOptions = any;

export default {
  ERROR_CODES,
  oAuthProvidersSchema,
  OAuthProvidersSchema,
};
