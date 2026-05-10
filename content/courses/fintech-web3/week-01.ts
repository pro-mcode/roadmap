import type { Week } from "@/types/content";
import {
  blocks,
  callout,
  code,
  diagram,
  h2,
  h3,
  p,
  ul,
} from "@/content/courses/_helpers";

export const week01: Week = {
  id: "week-01",
  number: 1,
  title: "Foundations: Internet, Linux, Git, and the engineering mindset",
  stage: "Foundation Layer",
  summary:
    "Anchor the rest of the path in real fundamentals: how the internet actually delivers a request, how UNIX-shaped tooling shapes daily work, and how git workflows survive contact with multi-engineer teams.",
  objectives: [
    "Explain a request from DNS lookup to TCP handshake to TLS to HTTP response.",
    "Operate confidently in a Linux shell using pipes, processes, and permissions.",
    "Use git as a precise communication tool, not just a save button.",
    "Read system architectures and form a mental model from a single diagram.",
  ],
  concepts: [
    "OSI vs TCP/IP layers",
    "DNS, TCP, TLS, HTTP/1.1, HTTP/2, HTTP/3 (QUIC)",
    "Process model, file descriptors, signals",
    "Branching strategies, rebases, atomic commits",
    "Engineering trade-offs and decision logs",
  ],
  deliverables: [
    "Personal dotfiles repo with reproducible shell setup.",
    "Annotated diagram of a request lifecycle from browser to origin.",
    "Pull request authored with atomic commits and a clear narrative.",
  ],
  reviewGate:
    "Can you trace a single HTTPS request from a user's keyboard to your origin server, naming every protocol and failure mode?",
  stack: ["Linux", "Bash/Zsh", "git", "DNS", "HTTP"],
  modules: [
    {
      id: "w01-m1",
      title: "How the internet works",
      summary:
        "Build a precise mental model of the request path. Most senior bugs hide between the layers we forgot to learn.",
      lessons: [
        {
          id: "w01-l1",
          slug: "request-lifecycle",
          title: "The lifecycle of an HTTPS request",
          summary:
            "Trace what happens between a user pressing Enter and your application returning a response. Every layer is a potential failure mode you'll meet again.",
          estimatedMinutes: 35,
          difficulty: "beginner",
          tags: ["networking", "http", "tls", "dns"],
          blocks: blocks(
            h2("From keystroke to byte stream"),
            p(
              "When a user types a URL and hits Enter, a stack of protocols collaborates to deliver the response. Each one is independently fallible, and each one shapes how you should design APIs and operate services.",
            ),
            diagram(
              `Browser
   │  1. DNS resolve
   ▼
DNS Resolver ──▶ Authoritative NS
   │                       │
   │  2. IP returned        │
   ▼                       │
Browser ◀──────────────────┘
   │  3. TCP handshake (SYN, SYN-ACK, ACK)
   ▼
Server (load balancer)
   │  4. TLS handshake (ClientHello → ServerHello → cert → key exchange)
   ▼
Server (TLS terminated)
   │  5. HTTP/1.1, HTTP/2 multiplexed, or HTTP/3 over QUIC
   ▼
Application server
   │  6. Auth, routing, query, response
   ▼
Browser (renders bytes)`,
              "Request lifecycle",
              "Each arrow is a place where latency, retries, and failures originate.",
            ),
            h3("DNS"),
            p(
              "DNS resolution looks up the domain name and returns one or more IP addresses. Recursive resolvers cache aggressively, so propagation is asynchronous. TTLs and split-horizon DNS are routine sources of 'works on my machine' bugs.",
            ),
            h3("TCP"),
            p(
              "TCP guarantees ordered, reliable byte delivery between two sockets. The three-way handshake (SYN / SYN-ACK / ACK) is the cheapest correctness primitive on the internet — but every connection has setup cost, which is why connection pools matter.",
            ),
            h3("TLS"),
            p(
              "TLS proves the server is who it claims to be (via certificate chains rooted in trust stores) and negotiates a symmetric session key. Modern stacks use TLS 1.3 with single-roundtrip handshakes; older stacks did 2-RTT.",
            ),
            h3("HTTP"),
            p(
              "HTTP/1.1 is one request per connection (with keep-alive). HTTP/2 multiplexes streams over a single TCP connection. HTTP/3 runs over QUIC (UDP) so a single packet loss doesn't head-of-line block the whole connection.",
            ),
            callout(
              "production",
              "When you debug a 'flaky' service, name the layer first. 'It's slow' is not actionable; 'TLS handshake p95 jumped from 30ms to 240ms' is.",
              "Naming the layer is half the fix",
            ),
            code(
              "bash",
              `# Inspect each layer of a single request
dig +trace +short api.example.com           # DNS
curl -v --resolve api.example.com:443:1.2.3.4 \\
     -o /dev/null https://api.example.com   # TCP + TLS + HTTP
curl --http2 -I https://api.example.com     # negotiate HTTP/2
nghttp -v https://api.example.com           # inspect frames`,
              "A toolbox you'll keep using.",
            ),
          ),
          exercises: [
            {
              id: "w01-l1-e1",
              title: "Map a real request",
              difficulty: "beginner",
              prompt:
                "Pick a public API your favorite app uses. Capture a single request with curl -v and label every line with the protocol layer it belongs to.",
              acceptanceCriteria: [
                "Diagram identifies DNS, TCP, TLS, HTTP/2 framing.",
                "You can explain why the connection was reused (or not).",
                "You note one failure mode that would surface at each layer.",
              ],
              hints: [
                "Use --resolve to bypass DNS for a controlled experiment.",
                "Look at the Alt-Svc header to see whether the server advertises HTTP/3.",
              ],
            },
          ],
          quiz: [
            {
              id: "w01-l1-q1",
              question:
                "Why does HTTP/3 over QUIC mitigate head-of-line blocking that HTTP/2 over TCP suffers?",
              options: [
                "QUIC removes encryption overhead, so packets arrive faster.",
                "QUIC streams are independent and a lost packet only affects its own stream.",
                "QUIC uses TCP under the hood with priority queues.",
                "HTTP/3 forces servers to send fewer concurrent responses.",
              ],
              correctIndex: 1,
              explanation:
                "QUIC implements multiplexed streams above UDP. A dropped UDP datagram only stalls the affected stream, while in HTTP/2-over-TCP a dropped packet stalls every multiplexed stream until retransmission.",
            },
          ],
          interviewQuestions: [
            {
              id: "iv-w01-l1-1",
              level: "intermediate",
              category: "Networking",
              question:
                "A user reports intermittent 5-second delays loading your dashboard, but only on coffee shop wifi. What layers do you investigate and in what order?",
              modelAnswer:
                "Start with DNS — captive portals frequently redirect or delay DNS responses. Confirm with `dig` and `dnsmasq` logs. If DNS is healthy, inspect TCP handshake latency; coffee shop NATs commonly drop SYN packets under load. Then TLS — older networks may force renegotiation. Finally HTTP — if early bytes arrive but the response stalls, it's likely an upstream timeout or a captive portal injecting a redirect. Always isolate the layer before guessing at the application.",
              followUps: [
                "How would you reproduce the issue without flying to a coffee shop?",
                "What metric on the server side would confirm or refute a TLS issue?",
              ],
              tradeoffs: [
                "Aggressive client retries hide DNS issues but create thundering herds.",
                "Raising TLS session resumption increases throughput but expands the attack surface for replay.",
              ],
              realWorldExample:
                "Stripe's 2019 status page documented a multi-minute incident traced to a single misbehaving DNS resolver in a partner network — the application was healthy, the layer beneath was not.",
            },
          ],
          productionInsights: [
            {
              title: "Always know the layer",
              summary:
                "Every senior engineer carries a mental request lifecycle diagram. The diagram is the troubleshooting checklist.",
              details:
                "When you receive a vague bug report, refuse to skip layers. 'Slow' is meaningless without naming whether DNS, TCP, TLS, application, or downstream is slow. Capturing layer-specific metrics (e.g. handshake times) up front pays for itself within a single incident.",
            },
          ],
          resources: [
            {
              title: "High Performance Browser Networking",
              url: "https://hpbn.co",
              kind: "book",
              author: "Ilya Grigorik",
              note: "The canonical reference for HTTP, TCP, and TLS fundamentals.",
            },
            {
              title: "Cloudflare Learning Center: HTTP/3",
              url: "https://www.cloudflare.com/learning/performance/what-is-http3/",
              kind: "article",
            },
          ],
        },
        {
          id: "w01-l2",
          slug: "linux-shell-fluency",
          title: "Linux shell fluency",
          summary:
            "Build muscle memory for the day-to-day shell. The shell is your control plane for every server you'll ever ssh into.",
          estimatedMinutes: 40,
          difficulty: "beginner",
          tags: ["linux", "bash", "tooling"],
          blocks: blocks(
            h2("Files, processes, and pipes"),
            p(
              "Everything in Linux is a file or a process. Pipes connect them. Once that lens clicks, half the shell becomes obvious: tail follows a file, grep filters a stream, less paginates one. Composition is the entire game.",
            ),
            code(
              "bash",
              `# Find the top 10 files by size in the current tree
find . -type f -printf "%s\\t%p\\n" | sort -rn | head -10

# Watch logs and highlight failures
tail -F app.log | grep --color -E "ERROR|FATAL|panic"

# Build a one-shot histogram of HTTP status codes
awk '{print $9}' access.log | sort | uniq -c | sort -rn`,
              "Three composable shell idioms you'll use every week.",
            ),
            h3("Permissions and ownership"),
            ul([
              "rwx for owner / group / other; numeric form maps cleanly to bits.",
              "umask controls the default permission mask for newly created files.",
              "setuid, setgid, and sticky bits matter when reading legacy code.",
            ]),
            h3("Process model"),
            p(
              "Each process has a parent (PPID), a state (R, S, D, Z), and standard I/O streams. Understanding signals (SIGTERM, SIGKILL, SIGHUP) lets you write daemons that shut down gracefully instead of corrupting state under deploy.",
            ),
            callout(
              "tip",
              "Set up a dotfiles repo today. The compounding benefit of carrying your shell with you across machines, jobs, and incident responses is enormous.",
            ),
          ),
          exercises: [
            {
              id: "w01-l2-e1",
              title: "One-liner challenge",
              difficulty: "beginner",
              prompt:
                "Given an Nginx access.log, write a single shell pipeline that prints the top five client IPs by request count, excluding internal subnets.",
              acceptanceCriteria: [
                "Uses awk, sort, uniq, head.",
                "Filters out 10.0.0.0/8 with grep -v or awk.",
                "Runs in under 1 second on a 1M-line file.",
              ],
            },
          ],
          interviewQuestions: [
            {
              id: "iv-w01-l2-1",
              level: "intermediate",
              category: "Linux",
              question:
                "Your service is 'stuck' — it accepts connections but never responds. How do you debug from a shell with no application logs?",
              modelAnswer:
                "Confirm the process is alive (ps), check its state (top reveals D state for uninterruptible sleep, often disk or NFS), inspect open file descriptors (lsof) and active syscalls (strace -p). If it's a goroutine/threadpool deadlock, attach with the language-specific profiler. If state is D, the kernel is waiting on I/O — check dmesg, iostat, and any mounted network filesystems.",
              followUps: [
                "When is strace inappropriate in production?",
                "How do you snapshot stack traces for a JVM, Go, or Node service?",
              ],
            },
          ],
          resources: [
            {
              title: "The Linux Command Line",
              url: "https://linuxcommand.org/tlcl.php",
              kind: "book",
              author: "William Shotts",
            },
          ],
        },
        {
          id: "w01-l3",
          slug: "git-as-communication",
          title: "Git as communication, not as backup",
          summary:
            "A senior engineer's commits read like a paper trail. A junior engineer's commits read like 'wip wip wip'. We rebuild the difference here.",
          estimatedMinutes: 30,
          difficulty: "beginner",
          tags: ["git", "collaboration"],
          blocks: blocks(
            h2("The atomic commit"),
            p(
              "An atomic commit is one logical change, fully described, that builds and passes tests. The discipline of producing atomic commits forces you to think before you push, and it pays back tenfold during code review and incident archaeology.",
            ),
            ul([
              "One change per commit — refactor and behavior change are separate commits.",
              "Subject line ≤ 72 chars, imperative voice ('Add idempotency key', not 'Added').",
              "Body explains *why*. The diff already shows *what*.",
            ]),
            h3("Rebase vs merge"),
            p(
              "Rebase rewrites history to keep it linear. Merge preserves the actual graph. Neither is universally right. Rebase short-lived feature branches onto main; merge release branches to preserve the integration boundary. Force-push only your own branches — never shared ones.",
            ),
            code(
              "bash",
              `# Salvage 'wip' chaos into clean atomic commits
git rebase -i origin/main

# Bring a feature branch up to date without a merge bubble
git fetch origin
git rebase origin/main

# Co-author someone whose advice shaped this commit
git commit -m "Add idempotency key to /transfer

Co-authored-by: Maxwell <max@example.com>"`,
              "Three workflows you should run weekly.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w01-l3-1",
              level: "senior",
              category: "Git workflows",
              question:
                "A teammate force-pushed to a shared branch and erased four hours of your work. How do you recover?",
              modelAnswer:
                "Your reflog is the source of truth. `git reflog` lists every HEAD movement. Find the commit hash before the force-push and either `git reset --hard <hash>` on a recovery branch or `git cherry-pick` the commits forward. Once recovered, set branch protection and require reviewed PRs to prevent recurrence.",
              followUps: [
                "What branch protection settings would have prevented this?",
                "How would you detect this earlier with CI?",
              ],
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w01-set-1",
      level: "intermediate",
      category: "Engineering mindset",
      question:
        "How do you decide when a 'fundamentals' refresh is worth the time vs shipping the next feature?",
      modelAnswer:
        "Treat fundamentals as the lever that multiplies all future work. If your team is repeatedly bitten by the same class of bug — race conditions, DNS issues, retry storms — that's a signal the underlying mental model is missing. A two-day refresh on the fundamental usually saves a month of recurring incidents. Never refactor mid-incident; document the lesson, schedule the refresh, and ship calmly.",
    },
  ],
  productionInsights: [
    {
      title: "Build your incident vocabulary early",
      summary:
        "The faster you can name a problem precisely, the faster the team converges on the fix.",
      details:
        "Maintain a personal glossary of failure modes (head-of-line blocking, thundering herd, retry amplification, snapshot isolation drift). When someone describes a vague symptom in slack, you'll be the engineer who can give it a name and unblock the room.",
    },
  ],
};
