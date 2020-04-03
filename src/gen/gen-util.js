class GenUtil {
    static GetJWT() {
        return localStorage.getItem('token');
    }
    static SetJWT(val) {
        return localStorage.setItem('token', val);
    }
    static unSetJWT() {
        localStorage.removeItem('token');
    }

}
export default GenUtil;
