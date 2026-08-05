//! Tiny stub so the fixture is mixed Markdown/code.
//! Happy Desk should index this as an artifact with structural containment under `src/`.

pub fn workspace_label() -> &'static str {
    "sample-project"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn label() {
        assert_eq!(workspace_label(), "sample-project");
    }
}
