package com.nimesh.assetmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(value = "/api/${version}/auth/user")
@RequiredArgsConstructor
@RestController
public class UserController {}
