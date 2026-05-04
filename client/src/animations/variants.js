export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

export const containerVariants = {
  animate: { transition: { staggerChildren: 0.07 } }
};

export const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } }
};

export const modalVariants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.22,1,0.36,1] } },
  exit:    { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.16 } }
};

export const shakeVariants = {
  shake: { x: [0,-8,8,-6,6,-4,0], transition: { duration: 0.4 } }
};
