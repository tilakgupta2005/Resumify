from rank_bm25 import BM25Okapi


def bm25_search(documents, search_query, n=3):

    if not documents:
        return []
    # Tokenize documents
    tokenized_docs = [
        doc.lower().split()
        for doc in documents
    ]

    if not tokenized_docs:
        return []
        
    # Build BM25 index
    bm25 = BM25Okapi(tokenized_docs)

    # Tokenize query
    query_tokens = search_query.lower().split()

    # Get top N results
    results = bm25.get_top_n(
        query_tokens,
        documents,
        n=n
    )

    return results
