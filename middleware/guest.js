export default function({ store, redirect }) {
    if(store.getters['loggedIn']){
        let user = store.getters['user'];
        if(user.role_id === 3){
            return redirect('/user/dashboard')
        }
        if(user.role_id === 1){
            return redirect('/admin/dashboard')
        }
    }
}