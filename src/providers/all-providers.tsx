import withAuthorization from "./route-guard-provider";
import { withSnackbar } from "notistack";


export const withAllProviders = (Component: any) => {
    return withSnackbar(withAuthorization(Component) as any)
}