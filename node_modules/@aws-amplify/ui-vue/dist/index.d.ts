import type { App } from 'vue';
import { AmplifyButton, AmplifyCheckBox, AmplifyTextField, Authenticator, AuthenticatorForceNewPasswordFormFields, AuthenticatorSignUpFormFields, ConfirmResetPassword, ConfirmSignIn, ConfirmSignUp, ConfirmVerifyUser, FederatedSignIn, ForceNewPassword, PasswordControl, RenderInfo, ForgotPassword, SignIn, SignUp, VerifyUser } from './components/index';
import { useAuthenticator } from './composables/useAuth';
import './styles.css';
declare const _default: {
    install: (app: App) => void;
};
export default _default;
export { SignIn, SignUp, FederatedSignIn, Authenticator, AuthenticatorSignUpFormFields, AuthenticatorForceNewPasswordFormFields, RenderInfo, ForceNewPassword, PasswordControl, ForgotPassword, ConfirmResetPassword, ConfirmSignUp, ConfirmSignIn, ConfirmVerifyUser, VerifyUser, AmplifyTextField, AmplifyCheckBox, AmplifyButton, useAuthenticator, };
/**
 * Re-export public APIs from `@aws-amplify/ui`
 */
export { translations } from '@aws-amplify/ui';
//# sourceMappingURL=index.d.ts.map