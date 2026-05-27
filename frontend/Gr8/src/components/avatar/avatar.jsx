import holdingHands from "../../assets/images/holdingHands.png";
import adultHoldingHands from "../../assets/images/adultHoldingHands.jpg";

const clampAvatar = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return 1;
    }

    return Math.min(18, Math.max(1, parsed));
};

// Per-avatar tuning: x/y are percentages within the source image.
// Optional `zoom` overrides the component zoom prop for a specific avatar.
const AVATAR_HEAD_POSITIONS_SET_A = {
    1: { x: 7.2, y: 16.5 },
    2: { x: 17.6, y: 17.9 },
    3: { x: 29.0, y: 27.4 },
    4: { x: 39.5, y: 18.7 },
    5: { x: 50.0, y: 39.7 },
    6: { x: 59.0, y: 27.8 },
    7: { x: 70.3, y: 25.5 },
    8: { x: 80.2, y: 18.5 },
    9: { x: 90.7, y: 24.1 },
};

// Second set mirrors left-to-right order, mapped to IDs 10-18.
const AVATAR_HEAD_POSITIONS_SET_B = {
    10: { x: 3.3, y: 21.9, zoom: 2800 },
    11: { x: 11.4, y: 22.2, zoom: 2800 },
    12: { x: 18.2, y: 22.4, zoom: 2800 },
    13: { x: 30.6, y: 21.7, zoom: 2800 },
    14: { x: 37.4, y: 21.7, zoom: 3000 },
    15: { x: 58.5, y: 21.5, zoom: 2800 },
    16: { x: 71.5, y: 25.5, zoom: 2800 },
    17: { x: 77.6, y: 24.5, zoom: 2800 },
    18: { x: 90.6, y: 24.5, zoom: 3000 },
};

const Avatar = ({
    avatar = 1,
    size = 48,
    zoom = 2800,
    headYOffset = 0,
    className = "",
    style = {},
    alt = "Avatar",
}) => {
    // Default avatar
    if (avatar === 0) {
        return (
            <div
                className={className}
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-bg-muted)",
                    padding: "2px",
                    ...style,
                }}
            >
                <span
                    style={{
                        fontSize: size > 60 ? "12px" : "8px",
                        textAlign: "center",
                        color: "var(--color-ui-muted)",
                        fontWeight: 200,
                        marginTop: "1px",
                    }}
                >
                    Välj din ikon
                </span>
            </div>
        );
    }

    const avatarIndex = clampAvatar(avatar);
    const useSecondSet = avatarIndex >= 10;
    const positions = useSecondSet
        ? AVATAR_HEAD_POSITIONS_SET_B
        : AVATAR_HEAD_POSITIONS_SET_A;
    const { x, y, zoom: zoomOverride } = positions[avatarIndex] ?? AVATAR_HEAD_POSITIONS_SET_A[1];
    const backgroundImage = useSecondSet ? adultHoldingHands : holdingHands;
    const resolvedZoom = zoomOverride ?? zoom;

    return (
        <div
            className={className}
            role="img"
            aria-label={`${alt} ${avatarIndex}`}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px inset rgb(0 0 0 / 6%)",
                position: "relative",
                display: "inline-block",
                backgroundColor: "var(--color-bg-muted)",
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${resolvedZoom}% auto`,
                backgroundPosition: `${x}% calc(${y}% + ${headYOffset}%)`,
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 3px",
                ...style,
            }}
        />
    );
};

export default Avatar;
