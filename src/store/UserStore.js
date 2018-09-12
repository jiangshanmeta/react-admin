import {
    observable,
    action
} from "mobx"

class UserStore {
    @observable name = '';
    @observable privilege = [];

    @action.bound 
    resetUserInfo(){
        this.name = '';
        this.privilege = [];
    }

    @action.bound
    initUserInfo(data){
        this.name = data.name;
        this.privilege = data.privilege;
    }
}

export default new UserStore();