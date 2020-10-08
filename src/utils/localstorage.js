export default {
    saveUser(res){
      localStorage.setItem('token', res.token);
      localStorage.setItem('userID', res.data.id);
      localStorage.setItem('username', res.data.name);
    },
    removeUser(){
      localStorage.removeItem('username');
      localStorage.removeItem('userID');
      localStorage.removeItem('token');
    },
    save (key, value) {
      localStorage.setItem(key, value);
    },
    getLoginUser () {
      return localStorage.getItem('userID');
    },
    remove (key) {
      localStorage.removeItem(key);
    },
    clear () {
      localStorage.clear()
    }
}

  