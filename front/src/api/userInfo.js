export async function getUserInfos () {

    const token = localStorage.getItem('token');

    try {
        
        const response = await fetch('http://127.0.0.1:8000/api/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Erreur http : ${response.status}, ${data.message}`);
        }

        return data;

    } catch (err) {
        console.error(err);
    }
}