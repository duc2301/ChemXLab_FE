import { motion } from "framer-motion";

interface ElementProps {
    element: any;
    onClick: (element: any) => void;
    isDimmed?: boolean;
}


const getCategoryColor = (cat: string) => {
    const category = cat.toLowerCase();
    if (category.includes('alkali metal') && !category.includes('earth')) return 'bg-[#4DB6AC] text-white'; // Li (exclude alkaline earth)
    if (category.includes('alkaline earth')) return 'bg-[#FF7043] text-white'; // Be
    if (category.includes('lanthanide')) return 'bg-[#66BB6A] text-white';
    if (category.includes('actinide')) return 'bg-[#26A69A] text-white';
    if (category.includes('post-transition')) return 'bg-[#81C784] text-white'; // Al - Must be before transition
    if (category.includes('transition')) return 'bg-[#AB47BC] text-white'; // Sc
    if (category.includes('metalloid')) return 'bg-[#FFCA28] text-slate-900'; // B
    if (category.includes('nonmetal')) return 'bg-[#42A5F5] text-white'; // O
    if (category.includes('halogen')) return 'bg-[#29B6F6] text-white'; // F
    if (category.includes('noble gas')) return 'bg-[#EC407A] text-white'; // He
    return 'bg-slate-300 text-slate-700'; // Unknown/Other
};

const ElementCard = ({ element, onClick, isDimmed }: ElementProps) => {
    return (
        <motion.div
            layoutId={`element-${element.number}`}
            onClick={() => onClick(element)}
            className={`
        aspect-square rounded-sm p-1 cursor-pointer transition-all duration-300
        flex flex-col justify-center items-center relative overflow-hidden
        ${isDimmed ? 'opacity-10 grayscale scale-95' : 'hover:scale-125 z-0 hover:z-50 hover:shadow-xl opacity-100'}
        ${getCategoryColor(element.category)}
      `}
            style={{
                gridColumn: element.xpos,
                gridRow: element.ypos,
            }}
        >
            <div className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-medium opacity-80">{element.number}</div>
            <div className="font-bold text-sm sm:text-lg leading-none mt-1 mb-0.5">
                {element.symbol}
            </div>
            <div className="text-[7px] sm:text-[8px] truncate max-w-full px-0.5 font-medium opacity-90 leading-tight">
                {element.name}
            </div>
        </motion.div>
    );
};

export default ElementCard;
