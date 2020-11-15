export default function({ store, redirect }) {
    let user = store.getters['user'];
    if (user.mfa === 1 && user.authenticated_mfa !== 1){
      return redirect('/mfa');
    }
    if(user.role_id !== 1 && user.role_id !== 2){
        return redirect('/');
    }

}
