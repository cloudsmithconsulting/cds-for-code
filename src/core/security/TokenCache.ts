import Dictionary from "../types/Dictionary";

export enum TokenType {
    AccessToken,
    RefreshToken
}

export default class TokenCache {
    private constructor() {
        this.accessTokens = new Dictionary<string, string>();
        this.refreshTokens = new Dictionary<string, string>();
    }

    static readonly Instance: TokenCache = new TokenCache();

    private readonly accessTokens = new Dictionary<string, string>();
    private readonly refreshTokens = new Dictionary<string, string>();

    addToken(tokenType: TokenType, url: string, token: string) {
        switch (tokenType) {
            case TokenType.AccessToken:
                return this.accessTokens.containsKey(url) ? this.accessTokens[url] = token : this.accessTokens.add(url, token);
            case TokenType.RefreshToken:
                return this.refreshTokens.containsKey(url) ? this.refreshTokens[url] = token : this.refreshTokens.add(url, token);
        }
    }

    getToken(tokenType: TokenType, url: string) {
        switch (tokenType) {
            case TokenType.AccessToken:
                return this.accessTokens.containsKey(url) ? this.accessTokens.get(url) : undefined;
            case TokenType.RefreshToken:
                return this.refreshTokens.containsKey(url) ? this.refreshTokens.get(url) : undefined;                
        }
    }

    removeToken(tokenType: TokenType, url: string) {
        switch (tokenType) {
            case TokenType.AccessToken:
                return this.accessTokens.containsKey(url) ? this.accessTokens.remove(url) : false;
            case TokenType.RefreshToken:
                return this.refreshTokens.containsKey(url) ? this.refreshTokens.remove(url) : false;
        }
    }
}