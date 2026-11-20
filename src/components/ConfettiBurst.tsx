import React from 'react';

interface ConfettiBurstProps {
  active: boolean;
  extra?: boolean;
}

const CONFETTI_PIECES = [
  { color: '#FACC15', tx: '-85px', ty: '-115px', rot: '-210deg', delay: '0ms', shape: 'rect' },
  { color: '#38BDF8', tx: '-55px', ty: '-145px', rot: '180deg', delay: '40ms', shape: 'circle' },
  { color: '#4ADE80', tx: '-20px', ty: '-160px', rot: '-160deg', delay: '20ms', shape: 'rect' },
  { color: '#F472B6', tx: '25px', ty: '-155px', rot: '240deg', delay: '60ms', shape: 'circle' },
  { color: '#FB923C', tx: '62px', ty: '-138px', rot: '-260deg', delay: '30ms', shape: 'rect' },
  { color: '#A855F7', tx: '92px', ty: '-110px', rot: '200deg', delay: '70ms', shape: 'circle' },
  { color: '#EF4444', tx: '-72px', ty: '-80px', rot: '140deg', delay: '90ms', shape: 'rect' },
  { color: '#2DD4BF', tx: '76px', ty: '-85px', rot: '-140deg', delay: '80ms', shape: 'rect' },
  { color: '#FDE047', tx: '0px', ty: '-175px', rot: '300deg', delay: '10ms', shape: 'star' },
  { color: '#60A5FA', tx: '-40px', ty: '-110px', rot: '-120deg', delay: '100ms', shape: 'circle' },
  { color: '#34D399', tx: '42px', ty: '-112px', rot: '150deg', delay: '110ms', shape: 'rect' },
];

const EXTRA_CONFETTI_PIECES = [
  { color: '#FDE047', tx: '-115px', ty: '-140px', rot: '260deg', delay: '30ms', shape: 'rect' },
  { color: '#FB7185', tx: '115px', ty: '-145px', rot: '-250deg', delay: '50ms', shape: 'circle' },
  { color: '#38BDF8', tx: '-95px', ty: '-175px', rot: '190deg', delay: '80ms', shape: 'rect' },
  { color: '#4ADE80', tx: '98px', ty: '-178px', rot: '-180deg', delay: '70ms', shape: 'circle' },
  { color: '#C084FC', tx: '-30px', ty: '-195px', rot: '310deg', delay: '45ms', shape: 'rect' },
  { color: '#F97316', tx: '34px', ty: '-190px', rot: '-300deg', delay: '65ms', shape: 'circle' },
  { color: '#FACC15', tx: '-125px', ty: '-95px', rot: '140deg', delay: '110ms', shape: 'circle' },
  { color: '#2DD4BF', tx: '125px', ty: '-95px', rot: '-145deg', delay: '105ms', shape: 'rect' },
];

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ active, extra = false }) => {
  if (!active) return null;

  const pieces = extra ? [...CONFETTI_PIECES, ...EXTRA_CONFETTI_PIECES] : CONFETTI_PIECES;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 z-30"
    >
      {pieces.map((piece, idx) => (
        <span
          key={idx}
          className="animate-confetti-piece absolute block"
          style={
            {
              width: piece.shape === 'rect' ? '12px' : '11px',
              height: piece.shape === 'rect' ? '7px' : '11px',
              backgroundColor: piece.color,
              borderRadius: piece.shape === 'circle' ? '9999px' : '2px',
              border: '1.5px solid rgba(0,0,0,0.2)',
              animationDelay: piece.delay,
              '--tx': piece.tx,
              '--ty': piece.ty,
              '--rot': piece.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
