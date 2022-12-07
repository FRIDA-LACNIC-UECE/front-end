import { ref } from 'vue'
import { getToken } from 'src/store/auth/getters'

const user = ref(null)

export default function useAuthUser () {
    const isLoggedIn = () => {
        console.log(this.getToken)
        return !!getToken 
    }

    return {
        isLoggedIn
    }
}