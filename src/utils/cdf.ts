export function exponential_cdf(x) {
    return 1 - 2 ** -x;
}

export function log_normal_cdf(x) {
    // approximation
    return x / (1 + x);
}
