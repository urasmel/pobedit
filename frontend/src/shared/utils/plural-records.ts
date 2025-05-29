import plural from 'plural-ru';

export const pluralRecords = (count: number): string => {
    return plural((count ? count : 0), 'запись', 'записи', 'записей');
};
