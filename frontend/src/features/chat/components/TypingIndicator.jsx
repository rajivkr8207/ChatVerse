import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const TypingIndicator = () => {
    return (
        <div className="flex justify-start">
            <div className="bg-card rounded-2xl p-4 border border-border flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                        <MessageCircle size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI is thinking</span>
                </div>
                
                <div className="flex items-center gap-1 px-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TypingIndicator