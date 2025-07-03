import { FiCamera } from 'react-icons/fi'; // Feather camera icon

const Logo = () => {
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: '700',
                fontSize: '1.5rem',
                color: '#111',
                cursor: 'pointer',
                transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#111')}
        >
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    marginRight: '10px',
                    background: 'linear-gradient(135deg, #ff416c, #ff4b2b, #f9cb28)',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                }}
            >
                <FiCamera color="white" size={20} />
            </span>
            Digital Vault
            <style>
                {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
            </style>
        </div>
    );
};

export default Logo;
