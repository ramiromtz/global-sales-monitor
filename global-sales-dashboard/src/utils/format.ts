export function formatTime(iso: string): string {
    try {
        return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
        return '—';
    }
}
