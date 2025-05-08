function StatBox({ title, value}) {
  return (
    <div className="bg-[#2a2a2a] p-5 text-center md:h-40 rounded-lg w-35 md:w-[17%] shadow-[0_4px_8px_rgba(0,0,0,0.2)] m-2 min-w-0 md:min-w-[150px]">
      <h3 className="text-white font-bold md:text-xl">{title}</h3>
      <p className="text-white md:mt-5 md:text-xl">{value}</p>
    </div>  
  )
}

export default StatBox;