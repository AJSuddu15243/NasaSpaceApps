# Lunar Landing Site Navigation: Resources

Source: [NASA App Development Challenge 2024: Handbook and Coding Components](https://www.nasa.gov/learning-resources/app-development-challenge/adc-handbook-and-coding-components-2024/)
(page updated Jul 17, 2025). Files are hosted on NASA Box. Open each link and download the file into the
matching `data/<region>/` folder. Access problems: JSC-ADC@mail.nasa.gov

- Handbook (PDF): https://www.nasa.gov/wp-content/uploads/2023/08/adc-fy24-handbook-final-508.pdf
- Background: [NASA identifies candidate regions for Artemis III](https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-moon/) · [video](https://youtu.be/ocDzndmmE8I)

## Artemis III landing region data

Each region has four gridded files in polar stereographic format: **Latitude, Longitude, Height, Slope**.

| Region → `data/` dir | Latitude | Longitude | Height | Slope |
|---|---|---|---|---|
| Haworth → `haworth/` | [lat](https://nasagov.box.com/s/3ojbdqtzxj5e0uvowa1vtxb0g7bkx4eg) | [lon](https://nasagov.box.com/s/86kza9ooyjgjpd3tgwo4sccbc3h1uivd) | [height](https://nasagov.box.com/s/5og2sbcx8qy8em9rw35r8nqm503eh2ku) | [slope](https://nasagov.box.com/s/4rhufxe5vxm9pkjjf4eqsjo24347pmpi) |
| Peak Near Shackleton → `peak-near-shackleton/` | [lat](https://nasagov.box.com/s/6s4ie08jn4ssuwa4cfpe0neulcbdx5zk) | [lon](https://nasagov.box.com/s/0w21n6zvqbupliciap0ii7hg7wltlse2) | [height](https://nasagov.box.com/s/99nsn5tlz229qhbkgk2ii0ap59k5biaj) | [slope](https://nasagov.box.com/s/ebh3c910lo7ma6ok0aba7xqnqy9m4em1) |
| Connecting Ridge → `connecting-ridge/` | [lat](https://nasagov.box.com/s/u8k4j6iwcbbejggux9upkq1tdnhg4lxk) | [lon](https://nasagov.box.com/s/dfeqqp3cwriefrenjl7g0iqwknqj5gbo) | [height](https://nasagov.box.com/s/xv6n3ephx093llgpbwrlkkszk28fwivf) | [slope](https://nasagov.box.com/s/mvrk48pxp4cfupihjn30pliogv39z7qu) |
| Nobile Rim 1 → `nobile-rim-1/` | [lat](https://nasagov.box.com/s/rxfiqaia81mzu3u6waho1xfpnvc55nka) | [lon](https://nasagov.box.com/s/4dqt344hpvcrem8nys512crkhoocbo6y) | [height](https://nasagov.box.com/s/prqbmbiyjpetxz1vnrmu3zaf1l8s3ec6) | [slope](https://nasagov.box.com/s/s87k2hvy1llayecizana04iia2cz0ff5) |
| Faustini Rim A → `faustini-rim-a/` | [lat](https://nasagov.box.com/s/2r3l9k6onre32ttjsg5av3yvsmiexzdr) | [lon](https://nasagov.box.com/s/glyjpxokmwjstz1y3k3ncofnymy33cfl) | [height](https://nasagov.box.com/s/bf4nkk8npwo9ktb9mgow0skfz3iy9696) | [slope](https://nasagov.box.com/s/r70inptlpnnfci7t39o9ro9hs3vsjmyc) |
| Leibnitz Beta Plateau → `leibnitz-beta-plateau/` | [lat](https://nasagov.box.com/s/h6qfif6wyxnogubqej2xjm8wsyb2hrat) | [lon](https://nasagov.box.com/s/7oscckxs11z3728cwd7bmqaclooqsc84) | [height](https://nasagov.box.com/s/jaijxo6j11383h9qlvleul1ybgosn2fc) | [slope](https://nasagov.box.com/s/o52bq1em33slu4rc8ha4mllnfpefb4e5) |

Haworth also has a full **Digital Elevation Model**: https://nasagov.app.box.com/s/vnl2irqzm51o2gyzwbams0xoo90o3zqm. Appendix D of the handbook covers turning it into a Unity mesh.

## Lunar surface texture → `texture/`
- https://nasagov.box.com/s/gk4hctyqt47dljiuv88fbgq11dks9t2f

## Related
- Moon Trek (3D lunar surface tiles): https://trek.nasa.gov/moon/
- LROC QuickMap: https://quickmap.lroc.asu.edu/
- Safe and Precise Landing at Lunar Sites (NASA, 2023): https://ntrs.nasa.gov/api/citations/20230016301/downloads/Safe%20and%20Precise%20Landing%20at%20Lunar%20Sites.pdf
- Earlier ADC pages: [2023](https://www.nasa.gov/learning-resources/app-development-challenge/2023-handbook-and-coding-components/) · [2020](https://www.nasa.gov/learning-resources/app-development-challenge/2020-guide-and-coding-components/)

## Layout
```
LunarLandingSiteNavigation/
├── data/<region>/   # downloaded Lat/Lon/Height/Slope files (gitignored)
├── docs/            # handbook notes, write-ups
├── notebooks/       # exploration
└── src/             # pathfinding / slope-cost code
```
