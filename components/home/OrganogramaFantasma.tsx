/**
 * Organograma fantasma — retângulos vazios e linhas retas em --linha a 35%,
 * sem texto. A rede viva (fixa, atrás da seção translúcida) o atravessa,
 * ignorando os níveis: o estático contra o vivo é o argumento.
 */
export default function OrganogramaFantasma({
  className,
}: {
  className?: string;
}) {
  const caixa = "fill-none stroke-linha";
  return (
    <svg
      viewBox="0 0 640 420"
      className={className}
      aria-hidden="true"
      style={{ opacity: 0.65 }}
    >
      <g strokeWidth="1.5">
        {/* nível 1 */}
        <rect x="270" y="20" width="100" height="44" className={caixa} />
        {/* conectores verticais e horizontais */}
        <path
          d="M320 64 V96 M120 96 H520 M120 96 V128 M320 96 V128 M520 96 V128"
          className="stroke-linha"
          fill="none"
        />
        {/* nível 2 */}
        <rect x="70" y="128" width="100" height="44" className={caixa} />
        <rect x="270" y="128" width="100" height="44" className={caixa} />
        <rect x="470" y="128" width="100" height="44" className={caixa} />
        {/* conectores para nível 3 */}
        <path
          d="M120 172 V204 M60 204 H180 M60 204 V236 M180 204 V236
             M320 172 V204 M260 204 H380 M260 204 V236 M380 204 V236
             M520 172 V236"
          className="stroke-linha"
          fill="none"
        />
        {/* nível 3 */}
        <rect x="15" y="236" width="90" height="40" className={caixa} />
        <rect x="135" y="236" width="90" height="40" className={caixa} />
        <rect x="215" y="236" width="90" height="40" className={caixa} />
        <rect x="335" y="236" width="90" height="40" className={caixa} />
        {/* nível 4 parcial — o organograma continua para fora do quadro */}
        <path
          d="M60 276 V308 M160 308 H60 M160 308 V340 M460 276 V308 M560 308 H460 M560 308 V340"
          className="stroke-linha"
          fill="none"
        />
        <rect x="115" y="340" width="90" height="40" className={caixa} />
        <rect x="515" y="340" width="90" height="40" className={caixa} />
      </g>
    </svg>
  );
}
