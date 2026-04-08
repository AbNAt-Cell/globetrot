library uzo_flutter;

import 'dart:convert';
import 'package:http/http.dart' as http;

class Uzo {
  final String apiKey;
  final String baseUrl;

  Uzo({required this.apiKey, this.baseUrl = 'https://api.uzo.com/v1'});

  Future<Map<String, dynamic>> route(Map<String, dynamic> requestData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/route'),
      headers: {'x-api-key': apiKey, 'Content-Type': 'application/json'},
      body: jsonEncode(requestData),
    );
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> matrix(Map<String, dynamic> requestData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/matrix'),
      headers: {'x-api-key': apiKey, 'Content-Type': 'application/json'},
      body: jsonEncode(requestData),
    );
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> geocode(String query) async {
    final response = await http.post(
      Uri.parse('$baseUrl/geocode'),
      headers: {'x-api-key': apiKey, 'Content-Type': 'application/json'},
      body: jsonEncode({'query': query}),
    );
    return jsonDecode(response.body);
  }
}
