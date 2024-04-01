package com.example.webphoto.config;

import com.example.webphoto.service.JWTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final JWTokenProvider tokenProvider;
    private static final String AUTH_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    // OncePerRequestFilter를 상속한 클래스에서 구현되어야 하는 메서드
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 요청에서 토큰 추출
        String token = getToken(request);

        // 토큰이 존재하는 경우
        if (token != null) {
            // 토큰이 유효한지 검증
            if (tokenProvider.isValidToken(token)) {
                // 토큰에서 Authentication 객체 추출
                Authentication authentication = tokenProvider.getAuthentication(token);
                // SecurityContextHolder에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // 토큰이 유효하지 않은 경우 예외 처리
                request.setAttribute("TokenException", "Invalid Token");
            }
        } else {
            // 토큰이 존재하지 않는 경우 예외 처리
            request.setAttribute("TokenException", "Token Required");
        }

        // 다음 필터로 이동
        filterChain.doFilter(request, response);
    }

    // 헤더에서 토큰 추출하는 메서드
    private String getToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(AUTH_HEADER);

        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            return authorizationHeader.substring(TOKEN_PREFIX.length());
        }
        return null;
    }
}
