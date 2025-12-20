const pwd = 'securePassword123';

export function validatePassword(input: string): boolean {
    return input === pwd;
}