# Contributing to ShieldSense

Thank you for your interest in contributing to ShieldSense! We appreciate your help in making this project better.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ShieldSense.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in README.md

## Development Guidelines

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints for better code clarity
- Write docstrings for functions and classes
- Include unit tests for new features
- Run `black . && flake8 .` before committing

```python
def analyze_text(content: str) -> dict:
    """
    Analyze text for scam indicators.
    
    Args:
        content: The text to analyze
        
    Returns:
        Analysis results with threat score and indicators
    """
    pass
```

### Frontend (React/JavaScript)

- Use functional components with hooks
- Follow React best practices
- Use meaningful component names
- Add PropTypes or TypeScript annotations
- Write clean, readable code

```javascript
function ThreatCard({ threat_score, threat_level }) {
  // Component code
}

ThreatCard.propTypes = {
  threat_score: PropTypes.number.required,
  threat_level: PropTypes.string.required,
};
```

### Browser Extension

- Test on latest Chrome/Edge versions
- Use Manifest V3 standards
- Ensure privacy - no data collection
- Keep popup response time < 1s

## Commit Messages

Write clear, descriptive commit messages:

```
feat: Add email analysis capability

- Implement email parsing
- Add phishing detection patterns
- Include confidence scoring

Fixes #123
```

Format:
- Type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Scope: `backend`, `frontend`, `extension`, `docs`
- Message: Clear, imperative tone

## Pull Request Process

1. Update README.md with any new features or changes
2. Add tests for new functionality
3. Ensure all tests pass: `pytest` (backend), `npm test` (frontend)
4. Request review from maintainers
5. Address feedback and make requested changes
6. Merge once approved

## Testing

### Backend Tests
```bash
cd backend
pip install pytest pytest-cov
pytest --cov=.

# Run specific test
pytest tests/test_analyzer.py::test_text_analysis
```

### Frontend Tests
```bash
cd frontend
npm test

# With coverage
npm test -- --coverage
```

## Feature Ideas

Check [GitHub Issues](https://github.com/yourusername/ShieldSense/issues) for:
- Bugs to fix
- Features to implement
- Improvements to discuss

## Areas We Need Help

- 🔧 Backend optimization
- 🎨 UI/UX improvements
- 🐧 Linux/Mac testing
- 📱 Mobile compatibility
- 🌍 Language translations
- 📚 Documentation
- 🧪 Test coverage
- 🔒 Security audits

## Questions?

- Check existing GitHub Issues
- Create a new Discussion for questions
- Email: dev@shieldsense.ai

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for making ShieldSense better! 🛡️
