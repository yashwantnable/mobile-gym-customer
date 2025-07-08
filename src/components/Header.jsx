import { motion } from 'framer-motion';

const Header = ({ content,text,background }) => {
    return (
        <div className="text-center mb-12 sm:mb-16">
            <motion.h2
                initial={{ y: -20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-3xl sm:text-4xl font-bold ${text ? text : "text-third" } mb-4`}
            >
                {content}
            </motion.h2>
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`w-24 h-1 ${background ? background : "bg-third" } mx-auto`}
            />
        </div>
    )
}

export default Header
