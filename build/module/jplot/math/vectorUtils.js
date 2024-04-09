export const closestPoint = (point, points) => {
    let minDist = Number.MAX_VALUE;
    let closest = points[0];
    points.forEach(p => {
        const dist = point.distance(p);
        if (dist < minDist) {
            minDist = dist;
            closest = p;
        }
    });
    return closest;
};
