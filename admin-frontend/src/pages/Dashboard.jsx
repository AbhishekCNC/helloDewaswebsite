export default function Dashboard() {
  return (
    <>
      <h2>Welcome, Admin 👋</h2>
      <p>Use the sidebar to manage News, Events, Banners, and Newspapers.</p>

      <div className="row mt-4">
        {[
          { title: "News", desc: "Manage all articles" },
          { title: "Events", desc: "Manage event posts" },
          { title: "Banners", desc: "Upload homepage banners" },
          { title: "Newspapers", desc: "Upload e-papers" },
        ].map((card, idx) => (
          <div className="col-md-3 mb-3" key={idx}>
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <h5>{card.title}</h5>
                <p>{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
