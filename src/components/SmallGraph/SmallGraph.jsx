import { ArrowNarrowDownIcon, ArrowNarrowUpIcon } from "@heroicons/react/outline";
import './SmallGraph.css'
const SmallGraph = ({ data, simple, onClick, loading }) => {
    const { name, total, percent } = data

    const handleClick = () => {
        if (typeof onClick === 'function') {
            onClick(data)
        }
    }
    return (

        <div onClick={handleClick} className="cursor-pointer">
            {simple ? (
                <div className="card text-left flex justify-between item flex-col w-80">
                    <div>
                        <h1 className="inline">{name}</h1>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="card-container">
                            {loading ? <div className="skeleton w-11 h-9" /> : <h1 >{total}</h1>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card text-left flex justify-between item flex-col">
                    <div>
                        <h1 className="inline">{name}{" "}</h1>
                        <span>This Month</span>
                    </div>
                    {loading ? <div className="skeleton w-full h-9 mt-2" /> : (
                        <div className="flex justify-between items-center">

                            <div className="card-container">
                                <h1>{total}</h1>
                            </div>
                            <div className="flex">
                                {percent > 0 ? (
                                    <ArrowNarrowUpIcon className="w-4 h-4 mt-0.5 text-green-300" />
                                ) : (
                                    <ArrowNarrowDownIcon className="w-4 h-4 mt-0.5 text-red-100" />
                                )}
                                <span className={` 2xl:text-sm text-xs ${percent > 0 ? "text-green-300" : "text-red-100"}`}>{percent}%</span>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default SmallGraph;