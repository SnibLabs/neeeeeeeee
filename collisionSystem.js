class CollisionSystem {
    static circleRect(circle, rect) {
        // circle: {x, y, radius}
        // rect: {x, y, width, height}
        let dx = Math.abs(circle.x - (rect.x + rect.width / 2));
        let dy = Math.abs(circle.y - (rect.y + rect.height / 2));
        if (dx > (rect.width / 2 + circle.radius)) return false;
        if (dy > (rect.height / 2 + circle.radius)) return false;
        if (dx <= (rect.width / 2)) return true;
        if (dy <= (rect.height / 2)) return true;
        let cornerDistSq = (dx - rect.width / 2) ** 2 + (dy - rect.height / 2) ** 2;
        return (cornerDistSq <= (circle.radius ** 2));
    }

    static rectRect(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }
}
window.CollisionSystem = CollisionSystem;