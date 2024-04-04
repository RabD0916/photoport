package com.example.webphoto.service;

import com.example.webphoto.config.JwtProperties;
import com.example.webphoto.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.*;

import static org.springframework.security.core.userdetails.User.withUsername;

@Service
@RequiredArgsConstructor
public class JWTokenProvider {

    private final JwtProperties jwtProperties;

    private SecretKey key;
    private JwtParser parser;

    // 토큰 생성 메서드
    public String createToken(User user, Duration expiredAt) {
        Date now = new Date();
        Date exp = new Date(now.getTime()+expiredAt.toMillis());

        return Jwts.builder()
                .header().add(getHeader()).and() // 토큰 헤더에 정보 추가
                .claims() // 토큰 클레임에 정보 추가
                .issuedAt(now) // 토큰 발행 시간 추가
                .issuer(jwtProperties.getIssuer()) // 토큰 발행자 정보 추가
                .subject(user.getId()) // 토큰 주제 정보 추가
                .expiration(exp).and() // 토큰 만료 시간 추가
                .signWith(getKey(), Jwts.SIG.HS256) // 토큰 서명에 사용할 키 설정
                .compact();
    }

    // 유효한 토큰인지 확인하는 메서드
    public boolean isValidToken(String token) {
        if(parser == null) {
            parser = Jwts.parser().verifyWith(getKey()).build();
        }
        try {
            Jws<Claims> jws = parser.parseSignedClaims(token);
            return true;
        } catch(Exception e) {
            return false;
        }
    }

    // 토큰에서 클레임 정보를 가져오는 메서드
    public Claims getClaims(String token) {
        if(parser == null) {
            parser = Jwts.parser().verifyWith(getKey()).build();
        }
        try {
            Jws<Claims> jws = parser.parseSignedClaims(token);
            return jws.getPayload();
        } catch(Exception e) {
            return null;
        }
    }

    // 토큰으로 인증 정보를 가져오는 메서드
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        Set<SimpleGrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER" ));

        UserDetails userDetails = withUsername(claims.getSubject())
                .password(claims.getSubject())
                .build();
        return new UsernamePasswordAuthenticationToken(userDetails, token, authorities);
    }

    // 키를 가져오는 메서드
    private SecretKey getKey() {
        if(key==null) {
            key = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtProperties.getSecretKey()));
        }
        return key;
    }

    // 토큰 헤더 정보를 가져오는 메서드
    private Map<String, Object> getHeader() {
        Map<String, Object> header = new HashMap<>();
        header.put("typ", "JWT");
        header.put("alg", "HS256");
        return header;
    }

}
