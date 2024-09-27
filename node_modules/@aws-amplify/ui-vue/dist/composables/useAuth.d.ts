import { AuthMachineState } from '@aws-amplify/ui';
import { UseAuth } from '../types';
export declare const getQRFields: (state: AuthMachineState) => {
    totpIssuer?: string;
    totpUsername?: string;
};
export declare const useAuth: () => UseAuth;
export declare const useAuthenticator: () => any;
//# sourceMappingURL=useAuth.d.ts.map