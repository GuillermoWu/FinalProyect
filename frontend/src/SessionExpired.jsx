export default function SessionExpired(){
    return <>
    <div className="session-expired-layout">
        <p>Your Session Has Expired!</p>
        <a href="/login">Login</a>
    </div>  
    </>
}