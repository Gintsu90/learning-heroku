const Footer = () => {
    const footerStyle = {
        color: "green",
        fontStyle: "italic",
        fontSize: 16,
        padding: 10
    }
    return (
        <div style={footerStyle}>
            <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
        </div>
    )
}

export default Footer