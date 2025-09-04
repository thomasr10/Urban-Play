export async function getUserInfos (loggedFetch) {

    try {
        
        const data = await loggedFetch('http://127.0.0.1:8000/api/me', {
            method: 'GET',
        })

        if (!data) {
            throw new Error('Aucune donnée reçue');
        }

        return data;

    } catch (err) {
        console.error(err);
    }
}