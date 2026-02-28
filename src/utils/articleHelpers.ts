/**
 * Helper functions for article manipulation and filtering
 */

export interface ArticleBase {
    id: string;
    category: string;
    [key: string]: any;
}

/**
 * Returns a list of related articles based on category.
 * @param {ArticleBase} currentArticle - The article currently being viewed.
 * @param {ArticleBase[]} allArticles - The full list of available articles.
 * @param {number} limit - Maximum number of related articles to return (default 2).
 * @returns {ArticleBase[]} Array of related articles.
 */
export const getRelatedArticles = <T extends ArticleBase>(
    currentArticle: T,
    allArticles: T[],
    limit: number = 2
): T[] => {
    if (!currentArticle || !allArticles || !Array.isArray(allArticles)) {
        return [];
    }

    const related = allArticles.filter(
        (article) =>
            article.category === currentArticle.category && article.id !== currentArticle.id
    );

    return related.slice(0, limit);
};
