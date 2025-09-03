// app/loading.tsx
'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-[0.5px] bg-card-foreground">
      <motion.div
        className="h-1 bg-primary"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  )
}
