import {
    observable,
    action,
} from "mobx"
class LoginStore{
    @observable isLogin = false;

    @action setLogin(){
        this.isLogin = true;
    }

    @action setLogout(){
        this.isLogin = false;
    }

    @action.bound
    doLogin(){
        setTimeout(()=>{
            this.setLogin()
        },500);
    }

    @action.bound
    doLogout(cb){
        setTimeout(()=>{
            this.setLogout();
            cb();
        },500);
    }
}

export default new LoginStore();