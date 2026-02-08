const Background = () => {
    return (
        <div
        className="fixed inset-0 -z-10 h-full w-full min-h-screen bg-grid-responsive"
        style={{
          background: "#000000",
          backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
      `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />        
    )
}

export default Background   