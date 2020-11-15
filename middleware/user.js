export default function({ store, redirect }) {
    let user = store.getters['user'];
    let admin = store.getters['admin'];
    if(user.role_id !== 3){
        return redirect('/')
    }
    if(user.role_id === 3){
        if (user.mfa === 1 && user.authenticated_mfa !== 1){
            return redirect('/mfa');
        }
        if(store.getters['settings'].maintainence === '1'){
            return redirect('/user/maintainence');
        }
    }
}