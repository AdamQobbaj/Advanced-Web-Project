function StatBox({ title, value}) {
  return (
    <div className="stat-box">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>  
  )
}

export default StatBox;