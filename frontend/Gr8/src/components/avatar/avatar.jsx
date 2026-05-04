import holdingHands from "../../assets/images/holdingHands.png";

const clampAvatar = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return 1;
    }

    return Math.min(9, Math.max(1, parsed));
};

// Per-avatar tuning: x/y are percentages within the source image.
const AVATAR_HEAD_POSITIONS = {
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
                <span style={{
                    fontSize: size > 60 ? "12px" : "8px",
                    textAlign: "center",
                    color: "var(--color-ui-muted)",
                    fontWeight: 200,
                    marginTop: "1px",
                }}>
                    Välj din ikon
                </span>
            </div>
        );
    }

    const avatarIndex = clampAvatar(avatar);
    const { x, y } = AVATAR_HEAD_POSITIONS[avatarIndex] ?? AVATAR_HEAD_POSITIONS[1];

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
                backgroundImage: `url(${holdingHands})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${zoom}% auto`,
                backgroundPosition: `${x}% calc(${y}% + ${headYOffset}%)`,
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 3px",
                ...style,
            }}
        />
    );
};

export default Avatar;
