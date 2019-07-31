import withAuthorization from "./route-guard-provider";
import { withSnackbar } from "notistack";
import { withMatchParams } from "./with-url-provider";


export const withAllProviders = (Component: any) => {
    return withSnackbar(withAuthorization(withMatchParams(Component)) as any)
}