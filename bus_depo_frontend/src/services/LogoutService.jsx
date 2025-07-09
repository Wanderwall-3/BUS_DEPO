import { logoutApi } from './ApiService'

const LogoutService = async () => {
    try {
        const data = await logoutApi();
        return data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export default LogoutService
