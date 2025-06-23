function Button({ type, children}) {
    return (
        <button className="btn btn-orange" type={type}>{children}</button>
    )
}

export default Button;