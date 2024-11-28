import './App.css'
import LoginForm from "./components/LoginForm.tsx";
import {FC, useContext, useEffect, useState} from "react";
import {Context} from "./main.tsx";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser.ts";
import UserService from "./services/UserService.ts";

const App: FC = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, []);

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            console.log(response)
            setUsers(response.data)
        } catch (e: any) {
            console.error(e)
        }
    }

    if (store.isLoading) {
        return <div>Loading...</div>
    }

    if (!store.isAuth) {
        return <LoginForm/>
    }

    return (
        <>
            <h1>{store.isAuth ? `User is authorized ${store.user.email}` : 'Authorize please'}</h1>
            <h1>{store.user.isActivated ? 'Account is confirmed by mail' : 'Verify your account'}</h1>
            <button onClick={() => store.logout()}>Logout</button>
            <div>
                <button onClick={getUsers}>Get users list</button>
            </div>
            {users.map(user => {
                return <div key={user.id}>{user.email}</div>
            })}
        </>
    )
}

export default observer(App)
