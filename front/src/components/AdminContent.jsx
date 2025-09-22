import AdminActivity from "./AdminActivity";

function AdminContent ({ id }) {

    const page = () => {
        switch(id) {
            case 0: return '0';
            case '1': return <AdminActivity/>
            case '2': return '2'
            case '3': return '3'
            case '4': return '4'
        }
    }

    return (
        page()
    )
}

export default AdminContent;